# Inplace-edit Guide
The inplace-edit feature is supported in the generated test scenario files.

## What's inplace-edit feature
Traditionally, file contents in auto-gen files will be covered/lost every time run codegen.
With inplace-edit feature, you can edit generated files at will. And the changed content can be *merged* to the next round time auto-gen files.
So below circle is supported for codegen files:

auto-generate file --> modify it --> auto-generate file --> modify it-->...

With no fear to worry about modifed content loss in each auto-gen.


## What's the restrictions
This feature can be leveraged by following below rules:
- don't change className/functionName/variableName in autogen file.
- commit the manual modification before everytime run codegen. (to avoid unintend lose)
- code review needed: conflict happens in rare case.


## What's a conflict
If both swagger and you make some change in one exactly same line of code, then there will be a conflict.

When confilct happens, both swagger change and manual change will be shown in generated file.

For instance:

1) If the generated code is like this:
~~~
    test.cmd('az desktopvirtualization workspace update '
             '--description "des2" '
             checks=checks)
~~~

2) and then you edit it manually into:
~~~
    test.cmd('az desktopvirtualization workspace update '
             '--description "des2_manual_change" '                  # this line is changed manually
             checks=checks)
~~~

3) in the same time, the --description in swagger example file is changed to "des2_swagger_change" 


4) So the conflicat happens, the generated code will be like below.
~~~
    test.cmd('az desktopvirtualization workspace update '
             '--description "des2_manual_change" '                  # manuall change
             '--description "des2_swagger_change" '                 # swagger change
             checks=checks)
~~~

5) In this case, conflict need to be handled manually (just delete the line you don't like in-placely).