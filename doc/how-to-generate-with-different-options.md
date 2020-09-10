Now autorest.az supports to generate code to the cli main repo.  
Besides we have several exciting command options that can be used for different kinds of requirements. 
With these options we can 
1. Generate a extension with vendored sdk but the sdk is un-flattened way.  
2. Generate a extension using public release sdk. 
3. Generate a extension using public release sdk with track1 adaption.
4. Generate a cli main repo modules.

## What kind of options do we have

### --target-mode option
This option is to determine whether you want to generate the cli extension or the cli main repo modules.  
```
--target-mode=extension means to generate a extension.  
--target-mode=core means to generate a cli main repo modules.  
```
If this option is not set. we will set the default value as extension and generate the cli extension.  

### --generate-sdk option
This option is to determine whether you want to generate vendored sdk or not. 
```
--generate-sdk=yes means to generate vendored sdk.
--generate-sdk=no means not to generate vendored sdk.
```
If this option is not set, the default value of --generate-sdk will be different according to --target-mode option value.  
which means if --target-mode=extension, the default value of --generate-sdk is yes and we will generate the sdk by default.  
If the --target-mode=core, the default value of --generate-sdk is no and we will not generate the vendored sdk.

### --compatible-level option
This option is to determine whether you want to adapt to track1 mode or not.
```
--compatible-level=track1 means to generate the code compatible to track1 sdk. 
--compatible-level=track2 means to generate the code compatible to track2 sdk.
```
If this option is not set, the default value of --compatible-level will be different according to --target-mode option value.  
which means if --target-mode=extension, the default value of --compatible-level is track2 and we will generate code compatible to track2 sdk.  
If the --target-mode=core, the default value of --compatible-level is track1 and we will generate code compatible to track1.  


### --sdk-no-flatten option
This option is to determine whether you want the sdk flattened or not. 
If this option is set but not as false, it means you don't want to flatten the sdk. 
If this option is not set or set as false, it means you want to flatten the sdk.  
This option will also be impact by --target-mode, if the --target-mode=extension, by default we will flatten the sdk. If the --target-mode=core, we will not flatten the sdk by default.   

## Most useful command options combination.
### Generate extension with default option.
```
autorest --az path-to-swagger-readme.md --azure-cli-extension-folder=path-to-azure-cli-extension-repo
```
### Generate cli main repo modules with default option
```
autorest --az path-to-swagger-readme.md --target-mode=core --azure-cli-folder=path-to-azure-cli-repo
```
### Generate a extension with vendored sdk but the sdk is un-flattened way. 
```
autorest --az path-to-swagger-readme.md --sdk-no-flatten --azure-cli-extension-folder=path-to-azure-cli-extension-repo
```
### Generate a extension using public released track2 sdk. 
```
autorest --az path-to-swagger-readme.md --generate-sdk=no --azure-cli-extension-folder=path-to-azure-cli-extension-repo
```
### Generate a extension using public released track1 sdk with track1 adaption.
```
autorest --az path-to-swagger-readme.md --generate-sdk=no --compatible-level=track1 --azure-cli-extension-folder=path-to-azure-cli-extension-repo
```
