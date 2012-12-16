:: Run this script when you need to change snake.soy to populate the new
:: snakehtml.js
cd %0/..
java -jar SoyToJsSrcCompiler.jar --outputPathFormat snakehtml.js snake.soy