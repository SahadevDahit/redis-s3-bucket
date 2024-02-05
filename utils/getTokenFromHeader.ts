export const getTokenFromHeader = (req: any): string | null => {
    // Get token from header
    const token = req?.headers?.authorization?.split(" ")[1];

    // Check if token is undefined or null
    if (!token) {
        // Return null or throw an error, depending on your use case
        return null;
    }

    return token;
};
