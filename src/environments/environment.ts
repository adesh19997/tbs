// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebase: {
      apiKey: 'AIzaSyAHdBM-Y1cnQ2ZATN3sdAv01SDc3SNo3Ws',
      authDomain: 'tecpixels-bs.firebaseapp.com',
      databaseURL: 'https://tecpixels-bs.firebaseio.com',
      projectId: 'tecpixels-bs',
      storageBucket: 'gs://tecpixels-bs.appspot.com/',
  },
  BASE_URL:"https://us-central1-tecpixels-bs.cloudfunctions.net/app/",
  PAYTM_MID:"pmePaM98534008405439"
};
