
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],

  synchronize: false,
  logging: false,
  migrationsTableName: 'migrations',
});

export default AppDataSource;
