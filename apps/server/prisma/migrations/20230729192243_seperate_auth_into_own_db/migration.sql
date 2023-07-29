/*
  Warnings:

  - You are about to drop the `all_auth_recipe_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboard_user_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboard_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emailpassword_pswd_reset_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emailpassword_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emailverification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emailverification_verified_emails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jwt_signing_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `key_value` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `passwordless_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `passwordless_devices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `passwordless_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_access_token_signing_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `thirdparty_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `totp_used_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `totp_user_devices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `totp_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_last_active` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userid_mapping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashboard_user_sessions" DROP CONSTRAINT "dashboard_user_sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "emailpassword_pswd_reset_tokens" DROP CONSTRAINT "emailpassword_pswd_reset_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "passwordless_codes" DROP CONSTRAINT "passwordless_codes_device_id_hash_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_fkey";

-- DropForeignKey
ALTER TABLE "totp_used_codes" DROP CONSTRAINT "totp_used_codes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "totp_user_devices" DROP CONSTRAINT "totp_user_devices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_role_fkey";

-- DropForeignKey
ALTER TABLE "userid_mapping" DROP CONSTRAINT "userid_mapping_supertokens_user_id_fkey";

-- DropTable
DROP TABLE "all_auth_recipe_users";

-- DropTable
DROP TABLE "dashboard_user_sessions";

-- DropTable
DROP TABLE "dashboard_users";

-- DropTable
DROP TABLE "emailpassword_pswd_reset_tokens";

-- DropTable
DROP TABLE "emailpassword_users";

-- DropTable
DROP TABLE "emailverification_tokens";

-- DropTable
DROP TABLE "emailverification_verified_emails";

-- DropTable
DROP TABLE "jwt_signing_keys";

-- DropTable
DROP TABLE "key_value";

-- DropTable
DROP TABLE "passwordless_codes";

-- DropTable
DROP TABLE "passwordless_devices";

-- DropTable
DROP TABLE "passwordless_users";

-- DropTable
DROP TABLE "role_permissions";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "session_access_token_signing_keys";

-- DropTable
DROP TABLE "session_info";

-- DropTable
DROP TABLE "thirdparty_users";

-- DropTable
DROP TABLE "totp_used_codes";

-- DropTable
DROP TABLE "totp_user_devices";

-- DropTable
DROP TABLE "totp_users";

-- DropTable
DROP TABLE "user_last_active";

-- DropTable
DROP TABLE "user_metadata";

-- DropTable
DROP TABLE "user_roles";

-- DropTable
DROP TABLE "userid_mapping";
