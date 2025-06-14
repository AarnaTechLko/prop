// src/db/schema.ts
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  serial,
  text,
  tinyint,
  date,
  decimal,
  
} from 'drizzle-orm/mysql-core';

// Users Table
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  mobile: int("mobile").notNull(),
  address: text("address"), // If you have this, include it
  createdAt: timestamp("created_at").defaultNow(),
});

// Admins Table
export const admins = mysqlTable("admins", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  mobile: varchar("mobile", { length: 20 }), // ✅ Add this line
  createdAt: timestamp("created_at").defaultNow(),
});






// Countries Table
export const countries = mysqlTable("countries", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  sortname: varchar("sortname", { length: 100 }).notNull(),
});

// States Table
export const states = mysqlTable("states", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  countryId: int("country_id").notNull(),
});

// Cities Table
export const cities = mysqlTable("cities", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  stateId: int("state_id").notNull(),
});




export const properties = mysqlTable('properties', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 1000 }),
  price: int('price'),
  type: varchar('type', { length: 100 }),
  country: varchar('country', { length: 100 }),
  state: varchar('state', { length: 100 }),
  city: varchar('city', { length: 100 }),
  address: varchar('address', { length: 255 }),
  bedrooms: int('bedrooms'),
  bathrooms: int('bathrooms'),
  image: varchar('image', { length: 500 }),
});


export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  user_id: int("user_id"),
  first_name: varchar("first_name", { length: 100 }),
  last_name: varchar("last_name", { length: 100 }),
  street_address: varchar("street_address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zip_code: varchar("zip_code", { length: 20 }),
  mailing_street_address: varchar("mailing_street_address", { length: 255 }),
  mailing_city: varchar("mailing_city", { length: 100 }),
  mailing_state: varchar("mailing_state", { length: 50 }),
  phone1: varchar("phone1", { length: 20 }),
  phone1_type: varchar("phone1_type", { length: 50 }),
  phone2: varchar("phone2", { length: 20 }),
  phone2_type: varchar("phone2_type", { length: 50 }),
  phone3: varchar("phone3", { length: 20 }),
  phone3_type: varchar("phone3_type", { length: 50 }),
  phone4: varchar("phone4", { length: 20 }),
  phone4_type: varchar("phone4_type", { length: 50 }),
  phone5: varchar("phone5", { length: 20 }),
  phone5_type: varchar("phone5_type", { length: 50 }),
  email1: varchar("email1", { length: 100 }),
  email2: varchar("email2", { length: 100 }),
  email3: varchar("email3", { length: 100 }),
  email4: varchar("email4", { length: 100 }),
  email5: varchar("email5", { length: 100 }),
  social_network1: varchar("social_network1", { length: 50 }),
  social_handle1: varchar("social_handle1", { length: 100 }),
  social_network2: varchar("social_network2", { length: 50 }),
  social_handle2: varchar("social_handle2", { length: 100 }),
  apn: varchar("apn", { length: 50 }),
  vacant: tinyint("vacant"),
  absentee: tinyint("absentee"),
  occupancy: varchar("occupancy", { length: 50 }),
  ownership_type: varchar("ownership_type", { length: 50 }),
  formatted_apn: varchar("formatted_apn", { length: 50 }),
  census_tract: varchar("census_tract", { length: 50 }),
  subdivision: varchar("subdivision", { length: 100 }),
  tract_number: varchar("tract_number", { length: 50 }),
  company_flag: tinyint("company_flag"),
  owner_type: varchar("owner_type", { length: 50 }),
  primary_owner_first: varchar("primary_owner_first", { length: 100 }),
  primary_owner_middle: varchar("primary_owner_middle", { length: 100 }),
  primary_owner_last: varchar("primary_owner_last", { length: 100 }),
  secondary_owner_first: varchar("secondary_owner_first", { length: 100 }),
  secondary_owner_middle: varchar("secondary_owner_middle", { length: 100 }),
  secondary_owner_last: varchar("secondary_owner_last", { length: 100 }),
  assessor_last_sale_date: date("assessor_last_sale_date"),
  assessor_last_sale_amount: decimal("assessor_last_sale_amount", { precision: 15, scale: 2 }),
  assessor_prior_sale_date: date("assessor_prior_sale_date"),
  assessor_prior_sale_amount: decimal("assessor_prior_sale_amount", { precision: 15, scale: 2 }),
  area_building: varchar("area_building", { length: 100 }),
  living_sqft: int("living_sqft"),
  area_lot_acres: decimal("area_lot_acres", { precision: 10, scale: 4 }),
  area_lot_sf: int("area_lot_sf"),
  parking_garage: varchar("parking_garage", { length: 50 }),
  pool: tinyint("pool"),
  bath_count: decimal("bath_count", { precision: 4, scale: 1 }),
  bedrooms_count: int("bedrooms_count"),
  stories_count: int("stories_count"),
  energy: varchar("energy", { length: 50 }),
  fuel: varchar("fuel", { length: 50 }),
  estimated_value: decimal("estimated_value", { precision: 15, scale: 2 }),
  estimated_min_value: decimal("estimated_min_value", { precision: 15, scale: 2 }),
  estimated_max_value: decimal("estimated_max_value", { precision: 15, scale: 2 })
});




