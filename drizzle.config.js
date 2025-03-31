import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials:{
    url: 'postgresql://interviewdb_owner:npg_izWBKYb64mOk@ep-bitter-scene-a5cxgsav-pooler.us-east-2.aws.neon.tech/interviewdb?sslmode=require'
  }
});
