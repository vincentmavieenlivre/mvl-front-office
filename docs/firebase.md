### list projects
``` firebase projects:list ```

### select projects
``` firebase use front-office-staging ```

### login
``` firebase login ```

### deploy 

#### hosting
```firebase deploy --only hosting ```

#### functions live reload
```
 cd functions
 tsc --watch
```


# emulator 
```firebase emulators:start ```

```firebase emulators:export  emulator_dumps/[name]```

```firebase emulators:start --import emulator_dumps/[name]```
