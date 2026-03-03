import fetch from 'node-fetch';

async function verify() {
    try {
        const response = await fetch('http://localhost:3000/api/licencia');
        console.log('Status:', response.status);
        const data = await response.json();

        console.log('Data:', JSON.stringify(data, null, 2));

        if (response.status === 200 && data.ok) {
            console.log('Verification SUCCESS');
        } else {
            console.log('Verification FAILED');
        }
    } catch (error) {
        console.error('Error verifying API:', error);
    }
}

verify();
