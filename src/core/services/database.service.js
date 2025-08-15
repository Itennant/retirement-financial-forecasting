// Database Service for Financial Forecasting Application
import knex from 'knex';
import { createClient } from '@supabase/supabase-js';

class DatabaseService {
    constructor(config) {
        this.config = config;
        this.knexInstance = null;
        this.supabaseInstance = null;
        this.initializeConnection();
    }

    initializeConnection() {
        // Check if we should use Supabase (development mode with Supabase configured)
        if (this.config.environment === 'development' && 
            this.config.database.client === 'supabase' && 
            this.config.database.supabase.url && 
            this.config.database.supabase.key) {
            this.initializeSupabase();
        } else {
            // Default to SQLite
            this.initializeSQLite();
        }
    }

    initializeSQLite() {
        this.knexInstance = knex({
            client: 'sqlite3',
            connection: {
                filename: this.config.database.connection.filename
            },
            useNullAsDefault: true
        });

        console.log('Initialized SQLite database connection');
    }

    initializeSupabase() {
        // Create Supabase client
        this.supabaseInstance = createClient(
            this.config.database.supabase.url,
            this.config.database.supabase.key
        );

        // Create Knex instance for Supabase (PostgreSQL)
        this.knexInstance = knex({
            client: 'pg',
            connection: {
                connectionString: `${this.config.database.supabase.url}/postgres`,
                ssl: { rejectUnauthorized: false }
            }
        });

        console.log('Initialized Supabase database connection');
    }

    // Get the appropriate database instance
    getDB() {
        if (this.config.environment === 'development' && 
            this.config.database.client === 'supabase' && 
            this.supabaseInstance) {
            return this.supabaseInstance;
        }
        return this.knexInstance;
    }

    // Get Knex instance (for raw SQL queries)
    getKnex() {
        return this.knexInstance;
    }

    // Generic query methods that work with both SQLite and Supabase
    async select(table, conditions = {}) {
        try {
            if (this.supabaseInstance && 
                this.config.environment === 'development' && 
                this.config.database.client === 'supabase') {
                const { data, error } = await this.supabaseInstance
                    .from(table)
                    .select('*')
                    .match(conditions);
                
                if (error) throw new Error(error.message);
                return data;
            } else {
                return await this.knexInstance(table).where(conditions);
            }
        } catch (error) {
            console.error('Error in select:', error);
            throw error;
        }
    }

    async insert(table, data) {
        try {
            if (this.supabaseInstance && 
                this.config.environment === 'development' && 
                this.config.database.client === 'supabase') {
                const { data: insertedData, error } = await this.supabaseInstance
                    .from(table)
                    .insert(data)
                    .select();
                
                if (error) throw new Error(error.message);
                return insertedData;
            } else {
                const [id] = await this.knexInstance(table).insert(data);
                return { id };
            }
        } catch (error) {
            console.error('Error in insert:', error);
            throw error;
        }
    }

    async update(table, conditions, data) {
        try {
            if (this.supabaseInstance && 
                this.config.environment === 'development' && 
                this.config.database.client === 'supabase') {
                const { data: updatedData, error } = await this.supabaseInstance
                    .from(table)
                    .update(data)
                    .match(conditions)
                    .select();
                
                if (error) throw new Error(error.message);
                return updatedData;
            } else {
                const result = await this.knexInstance(table)
                    .where(conditions)
                    .update(data);
                return { updated: result };
            }
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    }

    async delete(table, conditions) {
        try {
            if (this.supabaseInstance && 
                this.config.environment === 'development' && 
                this.config.database.client === 'supabase') {
                const { data, error } = await this.supabaseInstance
                    .from(table)
                    .delete()
                    .match(conditions);
                
                if (error) throw new Error(error.message);
                return data;
            } else {
                const result = await this.knexInstance(table)
                    .where(conditions)
                    .del();
                return { deleted: result };
            }
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    }

    // Run raw SQL queries
    async raw(sql, bindings = []) {
        try {
            return await this.knexInstance.raw(sql, bindings);
        } catch (error) {
            console.error('Error in raw query:', error);
            throw error;
        }
    }

    // Close connections
    async close() {
        if (this.knexInstance) {
            await this.knexInstance.destroy();
        }
    }
    
    // Vector operations (Supports both Supabase and SQLite)
    async insertVector(table, data) {
        // For SQLite, convert embedding to JSON string if it's an array
        const vectorData = { ...data };
        if (vectorData.embedding && Array.isArray(vectorData.embedding)) {
            vectorData.embedding = JSON.stringify(vectorData.embedding);
        }
        
        if (this.supabaseInstance && 
            this.config.environment === 'development' && 
            this.config.database.client === 'supabase') {
            // For Supabase, we can insert directly
            // Note: In a real implementation with vector extension, 
            // you might need to convert the JSON string back to vector type
            return await this.knexInstance(table).insert(vectorData);
        } else {
            // For SQLite, insert with JSON string embedding
            return await this.knexInstance(table).insert(vectorData);
        }
    }
    
    async semanticSearch(table, queryVector, limit = 5) {
        if (this.supabaseInstance && 
            this.config.environment === 'development' && 
            this.config.database.client === 'supabase') {
            // Use raw SQL for vector similarity search with Supabase
            // Note: This assumes the embedding column is of vector type
            const sql = `
                SELECT *, embedding <-> ? as similarity
                FROM ${table}
                ORDER BY embedding <-> ?
                LIMIT ?
            `;
            return await this.knexInstance.raw(sql, [queryVector, queryVector, limit]);
        } else {
            // For SQLite, implement similarity search using Euclidean distance calculation
            // This is a simplified implementation - in practice, you might want to optimize this
            try {
                const allRecords = await this.knexInstance(table).select('*');
                const queryVectorArray = Array.isArray(queryVector) ? queryVector : JSON.parse(queryVector);
                
                // Calculate similarity scores for each record
                const scoredRecords = allRecords.map(record => {
                    try {
                        const recordVector = Array.isArray(record.embedding) ? 
                            record.embedding : JSON.parse(record.embedding);
                        
                        // Calculate Euclidean distance
                        let sum = 0;
                        for (let i = 0; i < queryVectorArray.length; i++) {
                            const diff = queryVectorArray[i] - recordVector[i];
                            sum += diff * diff;
                        }
                        const distance = Math.sqrt(sum);
                        
                        return {
                            ...record,
                            similarity: 1 / (1 + distance) // Convert distance to similarity score
                        };
                    } catch (parseError) {
                        // If parsing fails, assign a default similarity score
                        return {
                            ...record,
                            similarity: 0
                        };
                    }
                });
                
                // Sort by similarity and limit results
                const sortedRecords = scoredRecords
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, limit);
                
                return { rows: sortedRecords };
            } catch (error) {
                console.error('Error in SQLite semantic search:', error);
                // Return empty result set if search fails
                return { rows: [] };
            }
        }
    }
}

export default DatabaseService;
