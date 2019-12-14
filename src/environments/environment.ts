// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyDJnRF3i6U7zK4YgPritBGf6Pap8L-iU3o',
    authDomain: 'architenterprise-63174.firebaseapp.com',
    databaseURL: 'https://architenterprise-63174.firebaseio.com/',
    projectId: 'architenterprise-63174',
    storageBucket: 'gs://architenterprise-63174.appspot.com',
  },
  BASE_URL: "https://us-central1-architenterprise-63174.cloudfunctions.net/app/",
  PAYTM_URL:"https://securegw-stage.paytm.in/order/process",
  CALLBACK_URL:"https://architenterprise-63174.firebaseapp.com",
  PAYTM_MID:"pmePaM98534008405439",
  version:"AREP 0.0.1"
};
