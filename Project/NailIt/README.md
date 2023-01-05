# NailIt
"Nail It" It's a web for people to find the manicurist who they really need.

# update EF DB Context
* before using this command, please update the connection string. To connect to local Db.
Scaffold-DbContext -Connection "Server=.\sqlexpress;Database=NailitDB;Integrated Security=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -f
