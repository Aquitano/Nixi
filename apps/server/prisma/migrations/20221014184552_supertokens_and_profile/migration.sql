/*
 Warnings:

 - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
 - Changed the type of `userId` on the `articles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
 - Changed the type of `userId` on the `highlights` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
 - Changed the type of `userId` on the `tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
 */
-- DropForeignKey

ALTER TABLE "articles" DROP CONSTRAINT "articles_userId_fkey";

-- DropForeignKey

ALTER TABLE "highlights" DROP CONSTRAINT "highlights_userId_fkey";

-- DropForeignKey

ALTER TABLE "tags" DROP CONSTRAINT "tags_userId_fkey";

-- AlterTable

ALTER TABLE "articles" DROP COLUMN "userId",
    ADD COLUMN "userId" INTEGER NOT NULL;

-- AlterTable

ALTER TABLE "highlights" DROP COLUMN "userId",
    ADD COLUMN "userId" INTEGER NOT NULL;

-- AlterTable

ALTER TABLE "tags" DROP COLUMN "userId",
    ADD COLUMN "userId" INTEGER NOT NULL;

-- DropTable

DROP TABLE "users";

-- CreateTable

CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable

CREATE TABLE "all_auth_recipe_users" (
    "user_id" CHAR(36) NOT NULL,
    "recipe_id" VARCHAR(128) NOT NULL,
    "time_joined" BIGINT NOT NULL,
    CONSTRAINT "all_auth_recipe_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable

CREATE TABLE "emailpassword_pswd_reset_tokens" (
    "user_id" CHAR(36) NOT NULL,
    "token" VARCHAR(128) NOT NULL,
    "token_expiry" BIGINT NOT NULL,
    CONSTRAINT "emailpassword_pswd_reset_tokens_pkey" PRIMARY KEY ("user_id", "token")
);

-- CreateTable

CREATE TABLE "emailpassword_users" (
    "user_id" CHAR(36) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password_hash" VARCHAR(256) NOT NULL,
    "time_joined" BIGINT NOT NULL,
    CONSTRAINT "emailpassword_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable

CREATE TABLE "emailverification_tokens" (
    "user_id" VARCHAR(128) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "token" VARCHAR(128) NOT NULL,
    "token_expiry" BIGINT NOT NULL,
    CONSTRAINT "emailverification_tokens_pkey" PRIMARY KEY ("user_id", "email", "token")
);

-- CreateTable

CREATE TABLE "emailverification_verified_emails" (
    "user_id" VARCHAR(128) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    CONSTRAINT "emailverification_verified_emails_pkey" PRIMARY KEY ("user_id", "email")
);

-- CreateTable

CREATE TABLE "jwt_signing_keys" (
    "key_id" VARCHAR(255) NOT NULL,
    "key_string" TEXT NOT NULL,
    "algorithm" VARCHAR(10) NOT NULL,
    "created_at" BIGINT,
    CONSTRAINT "jwt_signing_keys_pkey" PRIMARY KEY ("key_id")
);

-- CreateTable

CREATE TABLE "key_value" (
    "name" VARCHAR(128) NOT NULL,
    "value" TEXT,
    "created_at_time" BIGINT,
    CONSTRAINT "key_value_pkey" PRIMARY KEY ("name")
);

-- CreateTable

CREATE TABLE "passwordless_codes" (
    "code_id" CHAR(36) NOT NULL,
    "device_id_hash" CHAR(44) NOT NULL,
    "link_code_hash" CHAR(44) NOT NULL,
    "created_at" BIGINT NOT NULL,
    CONSTRAINT "passwordless_codes_pkey" PRIMARY KEY ("code_id")
);

-- CreateTable

CREATE TABLE "passwordless_devices" (
    "device_id_hash" CHAR(44) NOT NULL,
    "email" VARCHAR(256),
    "phone_number" VARCHAR(256),
    "link_code_salt" CHAR(44) NOT NULL,
    "failed_attempts" INTEGER NOT NULL,
    CONSTRAINT "passwordless_devices_pkey" PRIMARY KEY ("device_id_hash")
);

-- CreateTable

CREATE TABLE "passwordless_users" (
    "user_id" CHAR(36) NOT NULL,
    "email" VARCHAR(256),
    "phone_number" VARCHAR(256),
    "time_joined" BIGINT NOT NULL,
    CONSTRAINT "passwordless_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable

CREATE TABLE "role_permissions" (
    "role" VARCHAR(255) NOT NULL,
    "permission" VARCHAR(255) NOT NULL,
    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role", "permission")
);

-- CreateTable

CREATE TABLE "roles" (
    "role" VARCHAR(255) NOT NULL,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("role")
);

-- CreateTable

CREATE TABLE "session_access_token_signing_keys" (
    "created_at_time" BIGINT NOT NULL,
    "value" TEXT,
    CONSTRAINT "session_access_token_signing_keys_pkey" PRIMARY KEY ("created_at_time")
);

-- CreateTable

CREATE TABLE "session_info" (
    "session_handle" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "refresh_token_hash_2" VARCHAR(128) NOT NULL,
    "session_data" TEXT,
    "expires_at" BIGINT NOT NULL,
    "created_at_time" BIGINT NOT NULL,
    "jwt_user_payload" TEXT,
    CONSTRAINT "session_info_pkey" PRIMARY KEY ("session_handle")
);

-- CreateTable

CREATE TABLE "thirdparty_users" (
    "third_party_id" VARCHAR(28) NOT NULL,
    "third_party_user_id" VARCHAR(256) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "time_joined" BIGINT NOT NULL,
    CONSTRAINT "thirdparty_users_pkey" PRIMARY KEY ("third_party_id", "third_party_user_id")
);

-- CreateTable

CREATE TABLE "user_metadata" (
    "user_id" VARCHAR(128) NOT NULL,
    "user_metadata" TEXT NOT NULL,
    CONSTRAINT "user_metadata_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable

CREATE TABLE "user_roles" (
    "user_id" VARCHAR(128) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role")
);

-- CreateTable

CREATE TABLE "userid_mapping" (
    "supertokens_user_id" CHAR(36) NOT NULL,
    "external_user_id" VARCHAR(128) NOT NULL,
    "external_user_id_info" TEXT,
    CONSTRAINT "userid_mapping_pkey" PRIMARY KEY ("supertokens_user_id", "external_user_id")
);

-- CreateIndex

CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles" ("userId");

-- CreateIndex

CREATE INDEX "all_auth_recipe_users_pagination_index" ON "all_auth_recipe_users" ("time_joined" DESC, "user_id" DESC);

-- CreateIndex

CREATE UNIQUE INDEX "emailpassword_pswd_reset_tokens_token_key" ON "emailpassword_pswd_reset_tokens" ("token");

-- CreateIndex

CREATE INDEX "emailpassword_password_reset_token_expiry_index" ON "emailpassword_pswd_reset_tokens" ("token_expiry");

-- CreateIndex

CREATE UNIQUE INDEX "emailpassword_users_email_key" ON "emailpassword_users" ("email");

-- CreateIndex

CREATE UNIQUE INDEX "emailverification_tokens_token_key" ON "emailverification_tokens" ("token");

-- CreateIndex

CREATE INDEX "emailverification_tokens_index" ON "emailverification_tokens" ("token_expiry");

-- CreateIndex

CREATE UNIQUE INDEX "passwordless_codes_link_code_hash_key" ON "passwordless_codes" ("link_code_hash");

-- CreateIndex

CREATE INDEX "passwordless_codes_created_at_index" ON "passwordless_codes" ("created_at");

-- CreateIndex

CREATE INDEX "passwordless_codes_device_id_hash_index" ON "passwordless_codes" ("device_id_hash");

-- CreateIndex

CREATE INDEX "passwordless_devices_email_index" ON "passwordless_devices" ("email");

-- CreateIndex

CREATE INDEX "passwordless_devices_phone_number_index" ON "passwordless_devices" ("phone_number");

-- CreateIndex

CREATE UNIQUE INDEX "passwordless_users_email_key" ON "passwordless_users" ("email");

-- CreateIndex

CREATE UNIQUE INDEX "passwordless_users_phone_number_key" ON "passwordless_users" ("phone_number");

-- CreateIndex

CREATE INDEX "role_permissions_permission_index" ON "role_permissions" ("permission");

-- CreateIndex

CREATE UNIQUE INDEX "thirdparty_users_user_id_key" ON "thirdparty_users" ("user_id");

-- CreateIndex

CREATE INDEX "user_roles_role_index" ON "user_roles" ("role");

-- CreateIndex

CREATE UNIQUE INDEX "userid_mapping_supertokens_user_id_key" ON "userid_mapping" ("supertokens_user_id");

-- CreateIndex

CREATE UNIQUE INDEX "userid_mapping_external_user_id_key" ON "userid_mapping" ("external_user_id");

-- AddForeignKey

ALTER TABLE "profiles"
    ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "all_auth_recipe_users" ("user_id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "articles"
    ADD CONSTRAINT "articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "tags"
    ADD CONSTRAINT "tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "highlights"
    ADD CONSTRAINT "highlights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "emailpassword_pswd_reset_tokens"
    ADD CONSTRAINT "emailpassword_pswd_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "emailpassword_users" ("user_id") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "passwordless_codes"
    ADD CONSTRAINT "passwordless_codes_device_id_hash_fkey" FOREIGN KEY ("device_id_hash") REFERENCES "passwordless_devices" ("device_id_hash") ON DELETE CASCADE ON
    UPDATE
        CASCADE;

-- AddForeignKey

ALTER TABLE "role_permissions"
    ADD CONSTRAINT "role_permissions_role_fkey" FOREIGN KEY ("role") REFERENCES "roles" ("role") ON DELETE CASCADE ON
    UPDATE
        NO ACTION;

-- AddForeignKey

ALTER TABLE "user_roles"
    ADD CONSTRAINT "user_roles_role_fkey" FOREIGN KEY ("role") REFERENCES "roles" ("role") ON DELETE CASCADE ON
    UPDATE
        NO ACTION;

-- AddForeignKey

ALTER TABLE "userid_mapping"
    ADD CONSTRAINT "userid_mapping_supertokens_user_id_fkey" FOREIGN KEY ("supertokens_user_id") REFERENCES "all_auth_recipe_users" ("user_id") ON DELETE CASCADE ON
    UPDATE
        NO ACTION;
