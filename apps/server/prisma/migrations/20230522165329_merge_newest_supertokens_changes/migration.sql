/*
  Warnings:

  - Added the required column `use_static_key` to the `session_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session_info" ADD COLUMN     "use_static_key" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "dashboard_user_sessions" (
    "session_id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "time_created" BIGINT NOT NULL,
    "expiry" BIGINT NOT NULL,

    CONSTRAINT "dashboard_user_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "dashboard_users" (
    "user_id" CHAR(36) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password_hash" VARCHAR(256) NOT NULL,
    "time_joined" BIGINT NOT NULL,

    CONSTRAINT "dashboard_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "totp_used_codes" (
    "user_id" VARCHAR(128) NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "is_valid" BOOLEAN NOT NULL,
    "expiry_time_ms" BIGINT NOT NULL,
    "created_time_ms" BIGINT NOT NULL,

    CONSTRAINT "totp_used_codes_pkey" PRIMARY KEY ("user_id","created_time_ms")
);

-- CreateTable
CREATE TABLE "totp_user_devices" (
    "user_id" VARCHAR(128) NOT NULL,
    "device_name" VARCHAR(256) NOT NULL,
    "secret_key" VARCHAR(256) NOT NULL,
    "period" INTEGER NOT NULL,
    "skew" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "totp_user_devices_pkey" PRIMARY KEY ("user_id","device_name")
);

-- CreateTable
CREATE TABLE "totp_users" (
    "user_id" VARCHAR(128) NOT NULL,

    CONSTRAINT "totp_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_last_active" (
    "user_id" VARCHAR(128) NOT NULL,
    "last_active_time" BIGINT,

    CONSTRAINT "user_last_active_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "dashboard_user_sessions_expiry_index" ON "dashboard_user_sessions"("expiry");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_users_email_key" ON "dashboard_users"("email");

-- CreateIndex
CREATE INDEX "totp_used_codes_expiry_time_ms_index" ON "totp_used_codes"("expiry_time_ms");

-- AddForeignKey
ALTER TABLE "dashboard_user_sessions" ADD CONSTRAINT "dashboard_user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "dashboard_users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "totp_used_codes" ADD CONSTRAINT "totp_used_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "totp_users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "totp_user_devices" ADD CONSTRAINT "totp_user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "totp_users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
