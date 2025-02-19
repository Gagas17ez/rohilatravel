import mysql.connector


def check_tables_in_database(host, username, password, database):
    try:
        # Attempt to connect to the MySQL database
        connection = mysql.connector.connect(
            host=host,
            user=username,
            password=password,
            database=database
        )

        if connection.is_connected():
            print(f"Connected to the MySQL database: {database}")

            # Create a cursor to execute SQL queries
            cursor = connection.cursor()

            # Retrieve the list of tables in the database
            cursor.execute("SHOW TABLES")

            # Fetch and print the table names
            tables = cursor.fetchall()
            if tables:
                print("Tables in the database:")
                for table in tables:
                    print(table[0])

            # Close the cursor and connection
            cursor.close()
            connection.close()
    except mysql.connector.Error as e:
        # If there's an error, print an error message
        print(f"Error connecting to the database: {str(e)}")


if __name__ == "__main__":
    host = '103.121.122.81'
    username = 'megalogi_admin'
    password = 'Anjay12345.'
    database = 'megalogi_rusli_travel'

    check_tables_in_database(host, username, password, database)
