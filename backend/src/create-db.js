
import pg from "pg";

const { Client } = pg;


const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",   
  password: "1234",   
  database: "postgres"
});

async function createDatabase() {
  try {
    await client.connect();
    const dbName = "pft";

    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully.`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error("❌ Error creating database:", err);
  } finally {
    await client.end();
  }
}

createDatabase();
