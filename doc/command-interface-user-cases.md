# CLI Code-Gen Command Interface Use Cases

Cli Code Generator use directive for customization:   
1. the autorest directive. For example:
    ``` 
    directive:
      - where:
          command: datafactory factory create
        set:
          command: datafactory create
    ```
    * Note: the name conventions in autorest directive of both **where clause** and **set clause** are azure cli command line name without the az prefixes.  

1. the cli directive. For example:
    ```
    cli:
      cli-directive:
        - where:
            group: Factories
            param: factoryName
          alias:
            - name
            - n
    ```
    * Note: the name conventions in cli directive of **where clause** are always using swagger name format. The name conventions in **set clause** should use snake case. Please refer to [this document](https://github.com/Azure/autorest.az/blob/master/doc/faq.md#how-to-find-swagger-name-used-by-directive) for more details if you have trouble finding the name in **where clause**  


## 1. Command Group

### 1.1 Combine command groups
```
az group1 cmd1*
az group2 cmd2*
==>
az group3 cmd1*
az group3 cmd2*
```

### Solution
```
directive:
    - where:
        group: group1
      set:
        group: group3
    - where:
        group: group2
      set:
        group: group3
```

  1. the group condition in where clause or set clause in this case is the azure cli command group name 
  1. Currently,The premise of this combination can work is that there're no the same command names in this two groups. otherwise, The second one will overwrite the first one. 

```
# Example:
directive:
    - where:
        group: kustoext cluster
      set:
        group: kustoext new-cluster
    - where:
        group: kustoext cluster-principal-assignment
      set:
        group: kustoext new-cluster
```

### 1.2 Split command groups
```
az group3 cmd1*
az group3 cmd2*
==>
az group1 cmd1*
az group2 cmd2*
```

### Solution
We can only split commands within one group into separate groups from the command directive level one by one.
```
directive:
    - where:
        command: group3 cmd1*
      set:
        command: group1 cmd1*
    - where:
        command: group3 cmd2*
      set:
        command: group2 cmd2*
```
An example would be:
```
# Example
directive:
    - where:
        command: kustoext cluster list-follower-database
      set:
        command: kustoext cluster follower-database list
    - where:
        command: kustoext cluster detach-follower-database
      set:
        command: kustoext cluster follower-database detach
    - where:
        command: kustoext cluster add-language-extension
      set:
        command: kustoext cluster language-extension add
    - where:
        command: kustoext cluster list-language-extension
      set:
        command: kustoext cluster language-extension list
    - where:
        command: kustoext cluster remove-language-extension
      set:
        command: kustoext cluster language-extension remove
```

### 1.3 Rename command groups

#### 1.3.1 Single-layer
```
az group1 cmd*
==>
az group2 cmd*
```
#### Solution
```
directive:
    - where:
        group: group1
      set:
        group: group2
```
Here the group name is cli command group name.

#### 1.3.2 Multiple-layers
```
az group1 sub-group1 cmd*
==>
az group2 sub-group2 cmd*
```
#### Solution
```
directive:
    - where:
        group: group1 sub-group1
      set:
        group: group2 sub-group2
```

### 1.4 Add command group

#### 1.4.1 Single-layer
```
az group cmd*
==>
az group [add-group] cmd*
az [add-group] group cmd*
```
#### Solution
```
// ==> az group [add-group] cmd*
directive:
    - where:
        group: group
      set:
        group: group [add-group]

// ==> az [add-group] group cmd*
directive:
    - where:
        group: group
      set:
        group: [add-group] group
```

#### 1.4.2 Multiple-layers
```
az group cmd*
==>
az group [add-group1] [add-group2] cmd*
az [add-group1] [add-group2] group cmd*
az [add-group1] group [add-group2] cmd*
```

#### Solution
```
// ==> az group [add-group1] [add-group2] cmd*
directive:
    - where:
        group: group
      set:
        group: group [add-group1] [add-group2]

// ==> az [add-group1] [add-group2] group cmd*
directive:
    - where:
        group: group
      set:
        group: [add-group1] [add-group2] group

// ==> az [add-group1] group [add-group2] cmd*
directive:
    - where:
        group: group
      set:
        group: [add-group1] group [add-group2]
```

### 1.5 Remove command group

#### 1.5.1 Single-layer
```
az group sub-group cmd*
==>
az sub-group cmd*
az group cmd*
```
#### Solution
```
// ==> az sub-group cmd*
directive:
    - where:
        group: group sub-group
      set:
        group: sub-group

// ==> az group cmd*
directive:
    - where:
        group: group sub-group
      set:
        group: group
```

#### 1.5.1 Multiple-layers
```
az group sub-group1 sub-group2 cmd*
==>
az group cmd*
az sub-group1 cmd*
az sub-group2 cmd*
```
#### Solution
```
// ==> az group cmd*
directive:
    - where:
        group: group sub-group1 sub-group2
      set:
        group: group

// ==> az sub-group1 cmd*
directive:
    - where:
        group: group sub-group1 sub-group2
      set:
        group: sub-group1

// ==> az sub-group2 cmd*
directive:
    - where:
        group: group sub-group1 sub-group2
      set:
        group: sub-group2
```

## 2. Command

### 2.1 Rename command
```
az group sub-group cmd1
==>
az group sub-group cmd2
```
### Solution

```
directive:
    - where:
        command: group sub-group cmd1
      set:
        command: group sub-group cmd2

// or 
cli:
    cli-directive
        - where:
            op: cmd1
          name:
            op: cmd2
    
```
1. the first directive way won't change anything in the SDK layer. The second one cli-directive will change the SDK layer. 
1. The cli-directive condition in where clause should be their swagger name which is in camel case. The cli-directive condition in set clause should be in snake case.  

### 2.2 Remove command
```
az group sub-group cmd1
az group sub-group cmd2
==>
az group sub-group cmd1
```
### Solution
```
cli:
    cli-directive:
        - where: 
            group: groupName // the group name in swagger camel case format
            op: cmd2Name // the cmd2 name in swagger camel case format
          hidden: true 
```

### 2.3 Move command

#### 2.3.1 Between layers
```
az group sub-group cmd1
==>
az group cmd1
```
#### Solution
```
directive:
    - where:
        command: group sub-group cmd1
      set:
        command: group cmd1
```
If it's all the commands inside sub-group that you want to move into group layer. Please use the group move directive to do that.  

#### 2.3.2 Between command groups
```
az group sub-group1 cmd1
==>
az group sub-group2 cmd1
```
#### Solution
```
directive:
    - where:
        command: group sub-group1 cmd1
      set:
        command: group sub-group2 cmd1
```

#### 2.3.3 Between layers and rename
```
az group sub-group cmd1
==>
az group cmd2
```
#### Solution
```
directive:
    - where:
        command: group sub-group cmd1
      set:
        command: group cmd2
```

#### 2.3.4 Between command groups and rename
```
az group sub-group1 cmd1
==>
az group sub-group2 cmd2
```
#### Solution
```
directive:
    - where:
        command: group sub-group1 cmd1
      set:
        command: group sub-group2 cmd2
```
The premise of this directive can work is that `az group sub-group2` already exists. Otherwise you need to find a way to make sure it exits.

## 3. Parameter

### 3.1 Rename parameter
```
az cmd --param1
==>
az cmd --param2
```

### Solution
```
cli:
    cli-directive:
        - where:
            param: param1
          name:
            param: param2

// or 
cli:
    cli-directive:
        - where:
            param: param1
          alias:
            - param2
```

### 3.2 Remove parameter
```
az cmd --param1 --param2
==>
az cmd --param1
```
### Solution
```
cli:
    cli-directive:
        - where:
            param: param2
          hidden: true
          defaultValue: val2
```
Please note that for non-required parameter we don't need to set the default value for it. but if it's required parameter, then default value is essential.  

### 3.3 Add parameter
```
az cmd --param1
==>
az cmd --param1 --param2
```

### 3.4 Add parameter alias
```
az cmd --param1
==>
az cmd --param1/--param2
```
### Solution
```
cli:
    cli-directive:
        - where:
            param: param1
          alias:
            - param1
            - param2
```

### 3.5 Required/optional
```
--param           : description
==>
--param [Required]: description
```
```
--param [Required]: description
==>
--param           : description
```
### Solution
```
// from non-required to required:
cli:
    cli-directive:
        - where:
            param: param1
          required: true

// from required to non-required
cli:
    cli-directive:
        - where:
            param: param1
          required: false
          defaultValue: val1
```

## 4. Description
### 4.1 command group

#### 4.1.1 Help message
```
az group:   description1
==>
az group:   description2
```
#### Solution
```
directive:
    - where:
        group: group
      set:
        group-description: description2
```
#### 4.1.2 Preview/Experimental tag
```
az group:   description
==>
az group [Preview]:   description
```

#### Solution
```
cli:
    cli-directive:
        - where:
            group: group // swagger camel case format
          set:
            extensionMode: preview
```
Please note that it's also the solution to command layer as well as parameter layer, just need to add the condition in where clause. but if it's the whole extension or main repo module mode you would like to change, you need to set the following config inside your readme.az.md:
```
extension-mode: preview
```

### 4.2 command

#### 4.2.1 Help message
```
az group cmd:   description1
==>
az group cmd:   description2
```
#### Solution
```
directive:
    - where:
        command: group cmd
      set:
        command-description: description2
```

#### 4.2.2 Preview/Experimental tag
```
az group              :   description
==>
az group cmd1[Preview]     :   description
az group cmd2[Experimental]:   description
```

#### Solution
```
cli:
    cli-directive:
        - where:
            group: group // swagger camel case format
            op: cmd1 // swagger camel case format
          set:
            extensionMode: preview
        - where:
            group: group // swagger camel case format
            op: cmd2 // swagger camel case format
          set:
            extensionMode: experimental
```

#### 4.2.3 Example
```
az group cmd
==>
az group cmd
Examples
    example_description
        example_command
```
```
az group cmd
==>
az group cmd
Examples
    example_description1
        example_command1
    example_description2
        example_command2
```

### 4.3 parameter

#### 4.3.1 Help message
```
--param1:   description1
==>
--param1:   description2
```
#### Solution
```
directive:
    - where:
        parameter-name: param1
      set:
        parameter-description: description2
```
#### 4.3.2 Preview/Experimental tag
```
--param1               :   description
==>
--param1 [Preview]     :   description
--param1 [Experimental]:   description
```
#### Solution
```
cli:
    cli-directive:
        // set as Preview
        - where:
            group: group // swagger camel case format
            op: cmd1 // swagger camel case format
            param: param1 // swagger camel case format
          set:
            extensionMode: preview

        // set as Experimental
        - where:
            group: group // swagger camel case format
            op: cmd2 // swagger camel case format
            param: param1 // swagger camel case format
          set:
            extensionMode: experimental
```