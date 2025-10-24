const path = require('path');
module.exports = function(config){
  config.set({
    frameworks: ['jasmine'],
    files: ['src/tests/**/*.spec.js'],
    preprocessors: { 'src/tests/**/*.spec.js': ['webpack', 'sourcemap'] },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          { test:/\.jsx?$/, exclude:/node_modules/, use:{ loader:'babel-loader', options:{ presets:[['@babel/preset-env',{targets:{chrome:'114'}}], ['@babel/preset-react',{runtime:'automatic'}]] } } },
          { test:/\.css$/, use:['style-loader','css-loader'] }
        ]
      },
      resolve:{ extensions:['.js','.jsx'] }
    },
    reporters:['progress'],
    browsers:['ChromeHeadless'],
    singleRun:false
  });
};
