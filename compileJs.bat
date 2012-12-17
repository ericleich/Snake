:: Run this script when you change JavaScript files to recompile
:: snake-compiled.js. This script assumes you have the closure
:: library and the compiler.jar in the same directory as this script,
:: and python installed in E:/Python27.
cd %0/..
E:/Python27/python closure-library/closure/bin/build/closurebuilder.py ^
  --root=. ^
  --namespace="snake" ^
  --output_mode=compiled ^
  --compiler_jar=compiler.jar ^
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" ^
  > snake-compiled.js