# Blood Donation App - Backend

This is the backend repository for the Blood Donation App. The application facilitates the process of requesting and donating blood. Users can register, log in, and create or respond to blood donation requests.

## Technologies Used

- **Express.js**: Node.js web application framework
- **Prisma**: ORM (Object-Relational Mapping) for TypeScript and JavaScript
- **PostgreSQL**: Relational database management system
- **TypeScript**: Typed superset of JavaScript

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd blood-donation-app
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/blood_donation"
    ```

    Replace `user` and `password` with your PostgreSQL username and password respectively, and `blood_donation` with your desired database name.

4. Run the database migrations:

    ```bash
    npx prisma migrate dev --name init
    ```

5. Start the server:

    ```bash
    npm start
    ```

## Features

- **User Authentication**: Register and log in securely.
- **Blood Donation Requests**: Users can create and respond to blood donation requests.
- **Secure Endpoints**: Endpoints are protected to ensure data privacy and security.
- **RESTful API**: Follows REST architectural principles for predictable URLs and resource-based interactions.

## API Documentation

API documentation will be available soon.

## Contributing

Contributions are welcome! Please follow the contribution guidelines outlined in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For inquiries and support, please contact the project maintainers:

- Email: [furqanrupom978@gmail.com](mailto:furqanrupom978@gmail.com)
- Twitter: [@ahmad288140](https://twitter.com/ahmad288140)
