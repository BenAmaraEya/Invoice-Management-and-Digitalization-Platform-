import { deleteFacture } from '../pages/delete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
// Mock AsyncStorage and axios
jest.mock('@react-native-async-storage/async-storage');
jest.mock('axios');
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn()
  }
}));

describe('deleteFacture function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the facture and update the factures list', async () => {
    // Mock AsyncStorage.getItem to return a mock token
    AsyncStorage.getItem.mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJ1c2VyUHJvZmlsIjoiZm91cm5pc3NldXIiLCJpYXQiOjE3MTQ0MjQxODF9.NgJBWnVcCoq9EhAEnEzWWehO4VfxFVMdvo44nkpn4Kw');

    // Mock the axios.delete implementation
    axios.delete.mockResolvedValue({ data: { success: true, message: 'Facture deleted successfully' } });

    // Call the deleteFacture function
    await deleteFacture(100, 1484);

    // Assertions to check if AsyncStorage.getItem and axios.delete were called with the correct arguments
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    expect(axios.delete).toHaveBeenCalledWith('http://192.168.0.5:3006/facture/fournisseur/100/facture/1484', {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJ1c2VyUHJvZmlsIjoiZm91cm5pc3NldXIiLCJpYXQiOjE3MTQ0MjQxODF9.NgJBWnVcCoq9EhAEnEzWWehO4VfxFVMdvo44nkpn4Kw'
      },
    });

    // Assertions to check if the success message is displayed
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Facture deleted successfully.');
  });

  it('should show an error message if AsyncStorage.getItem fails', async () => {
    // Mock AsyncStorage.getItem to throw an error
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('AsyncStorage Error'));

    // Call the deleteFacture function
    await deleteFacture(100, 1484);

    // Assertions to check if the error message is displayed
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'An error occurred while getting token.');
  });

  it('should show an error message if axios.delete fails', async () => {
    // Mock AsyncStorage.getItem to return a mock token
    AsyncStorage.getItem.mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJ1c2VyUHJvZmlsIjoiZm91cm5pc3NldXIiLCJpYXQiOjE3MTQ0MjQxODF9.NgJBWnVcCoq9EhAEnEzWWehO4VfxFVMdvo44nkpn4Kw');

    // Mock the axios.delete implementation to throw an error
    axios.delete.mockRejectedValueOnce(new Error('axios.delete Error'));

    // Call the deleteFacture function
    await deleteFacture(100, 1484);

    // Assertions to check if the error message is displayed
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'An error occurred while deleting facture.');
  });

  // Add more test cases to cover different scenarios
});
