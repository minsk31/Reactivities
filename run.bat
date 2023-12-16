: cd API directory, and start .NET
cd API
start cmd.exe /k "dotnet watch"

:: cd to client-app, and start that
cd ../client-app
start cmd.exe /k "npm start"