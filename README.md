# Proofreadme
Readme enforcer/validation tool. Make sure your readme is still valid by running the logic in the readme.

## Example
````
// README-example.md
# Welcome
Welcome to foobar. To setup and start the app use the following commands
```
# @prm-ignore-1 (ignores the next line in proofreadme validation)
npm install
# @prm-wait-until-regex-output-/Listening on port/ (wait for response before allowing the next action to occur)
npm start
```
To run e2e tests on the app, use
```
# @prm-final (when this command runs successfully, close all processes and exit with success signal)
npm run e2e
```
````
---

```
$ proofreadme -p README-example.md -h # Welcome
> npm start ...
> npm run e2e ...
> README-example.md run successfully
```

### Explanation
We run proofreadme on the `README-example.md` file. First, we choose the header that we want to run commands from. We've chosen `### Welcome`. Then it runs the `npm start` command and waits for a specific output before allowing the next command to run. This is only necessary for tasks that we need to keep alive. When the next command `npm run e2e` finishes, we know that the process has executed successfully.

## Why is proofreadme necessary?
It's not unusual for readme files to become stale, which makes it harder for new team members to get started on a project. By running proofreadme as a part of the ci process, there is some ability to reduce the likelihood of a stale readme file.

## CLI commands

### -h, --headers <headers> (required)
Select which headers in the readme you would like to run the code segments from.

Example:
````
# A Package
## Setup
```
npm install
```
## Advanced
```
npx package --init
```
## Tests
```
npm test
```
````
---
````
$ proofreadme -h "# A Package"
> npm install
> npx package --init
> npm test
````
````
$ proofreadme -h "## Setup" "## Tests"
> npm install
> npm test
````

### -p, --readme-path [path] (optional)
Provide the path to the readme file. (By default, will look for `README.md`, `readme.md`, and `Readme.md`)

````
$ proofreadme -p ./READ-ME.md
````

## @prm-directives

### @prm-ignore-x
Do not run the next x lines.

Example:
```
echo 1
# @prm-ignore-2
echo 2
echo 3
echo 4
```
Output:
```
> 1
> 4
```

### @prm-wait-until-regex-output-/x/
For the line that follows this directive, wait until the regex x matches the stdout before moving to the next command. This is useful when you want to run tests against another process, like a web server.

Example:
```
# @prm-wait-until-regex-output-/Accepting connections/
npx serve -p 3001
curl http://localhost:3000
```
Explanation:

The curl command only fires after the serve command outputs `Accepting connections`.

## Upcoming Features
 - [ ] @prm-threads-x (Run commands in different threads)
 - [ ] @prm-final-regex-output (When to exit long-running tasks)
 - [ ] @prm-section-match-/x/-/y/-z (Use a double regex to ensure that your readme includes all of the regex matches of a particular file)
 - [ ] @prm-file-folder-structure (Verifies that the project has the file-folder structure in the readme)
 - [ ] @prm-multiline-x (Run multiple lines with a single command)

## Contributions
Contributions are welcome.