superuser="postgres"
superuser_password="testpassword"

echo "super user password = $superuser_password"
echo "creating role..."

PGPASSWORD="$superuser_password" psql -U "$superuser" -h localhost -d postgres -c "CREATE ROLE testuser WITH LOGIN PASSWORD 'testpassword'"
PGPASSWORD="$superuser_password" psql -U "$superuser" -h localhost -d postgres -c "ALTER ROLE testuser CREATEDB"

echo "creating test db..."

PGPASSWORD="$superuser_password" psql -U testuser -d postgres -c "CREATE DATABASE home_cloud_test"
PGPASSWORD="$superuser_password" psql -U testuser -d home_cloud_test -f db-setup.sql
