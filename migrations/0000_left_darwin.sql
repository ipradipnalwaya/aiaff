CREATE TABLE "extension_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"product_name" text NOT NULL,
	"plain_text" text NOT NULL,
	"html" text NOT NULL,
	"request_payload" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
