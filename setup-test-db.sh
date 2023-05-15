superuser="postgres"
superuser_password="testpassword"


export PGHOST=/var/run/postgresql
export PGUSER="$superuser"
export PGPASSWORD="$superuser_password"

echo "super user password = $superuser_password"
echo "creating role..."

psql -U "$superuser" -h localhost -d postgres -c "CREATE ROLE testuser WITH LOGIN PASSWORD 'testpassword'"
psql -U "$superuser" -h localhost -d postgres -c "ALTER ROLE testuser CREATEDB"

echo "creating test db..."

psql -U testuser -h localhost -d postgres -c "CREATE DATABASE home_cloud_test"
psql -U testuser -h localhost -d home_cloud_test -f db-setup.sql
