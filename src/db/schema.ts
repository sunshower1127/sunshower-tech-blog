import { index, integer, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 256 }).unique(),
    phone: varchar("phone", { length: 256 }),
    email: varchar("email", { length: 256 }).unique(),
    name: varchar("name", { length: 256 }),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  },
  (table) => [index().on(table.username)]
);

export const posts = pgTable(
  "post",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 256 }),
    description: text("description"),
    slug: varchar("slug", { length: 256 }).unique(),
    featuredImage: text("featured_image"),
    html: text("html"),
    authorId: uuid("author_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index().on(table.createdAt), index().on(table.slug)]
);

export const comments = pgTable(
  "comment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    text: text("text"),
    userId: uuid("user_id").references(() => users.id),
    postId: uuid("post_id").references(() => posts.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index().on(table.createdAt)]
);

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
