import axios from 'axios';
//const API_URL = 'http://localhost:4000/api/v2/staff';

const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/staff';

export const getCurrentUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/currentuser/${userId}`);
        console.log('User Data:', response.data);
        console.log(userId);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getAllStaff = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        console.log('User Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        throw error;
    }
};