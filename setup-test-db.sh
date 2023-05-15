export PGPASSWORD="031900"

echo "creating role..."

psql -U postgres -d postgres -c "CREATE ROLE testuser WITH LOGIN PASSWORD 'testpassword'"
psql -U postgres -d postgres -c "ALTER ROLE testuser CREATEDB"

echo "creating test db..."

export PGPASSWORD="testpassword"

psql -U testuser -d postgres -c "CREATE DATABASE home_cloud_test"
psql -U testuser -d home_cloud_test -f db-setup.sql
