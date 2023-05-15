superuser="postgres"
superuser_password=${POSTGRES_PASSWORD:"testpassword"}

echo "super user password = $superuser_password"
echo "creating role..."

psql -U "$superuser" -d postgres -c "CREATE ROLE testuser WITH LOGIN PASSWORD 'testpassword'"
psql -U "$superuser" -d postgres -c "ALTER ROLE testuser CREATEDB"

echo "creating test db..."

psql -U testuser -d postgres -c "CREATE DATABASE home_cloud_test"
psql -U testuser -d home_cloud_test -f db-setup.sql
