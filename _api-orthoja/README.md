# Orthoja API Service
The API service works in conjection with a database to allow other applications to store or receive common data. It also manages what applications are and aren't allowed to request. Applications can establish sessions when proper credentials are send to this service. Furthermore, API keys can be distributed to permit requests without the need of a session.

## Sessions
Sessions are given when linked to an account. In orthoja, there are two types of accounts: _Doctor accounts_ and _Patient accounts_. In order for the API to provide an application with a session, the application must sent a *REQUEST/Doctor_Login* or *REQUEST/Patient_Login* with proper credentials. When successful, the API server will respond with a session key. Other requests will require this session key, along with the account's ID, to perform privledged actions.

## API Keys
API keys are like sessions, but they don't require any login credentials with them. In fact, an API key can be viewed a a session key, username, and password all packaged together. Therefore, they should be treated as if it were a login credentials.