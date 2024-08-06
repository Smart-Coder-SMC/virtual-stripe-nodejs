git pull origin main

npm i

npx pm2 delete all

npx pm2 start index.js --name stripe-payment-generation
