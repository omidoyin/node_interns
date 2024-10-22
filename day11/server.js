'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * Server
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { app, apollo } = require('./app');


const PORT = 3001;

app.listen(PORT, () => {
  console.log('Server running at ', true ? `http://localhost:${PORT}` : 'process.env.BASE_URL');
  console.log('GraphQL running at ', true ? `http://localhost:${PORT}${apollo.graphqlPath}` : `${'process.env.BASE_URL'}${apollo.graphqlPath}`);
});
