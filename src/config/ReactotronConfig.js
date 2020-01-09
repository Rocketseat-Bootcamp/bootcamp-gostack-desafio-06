import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron
    .configure
    //CASO ESTEJA NO EMULADOR DO CELUALR  { host : 'ip da sua maquina'}
    ()
    .useReactNative()
    .connect();
  console.tron = tron;

  tron.clear();
}
