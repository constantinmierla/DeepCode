# How to run after clone

1. **Install deps**

  ```sh
    npm install
  ```

2. **Make env for python**

  ```sh
    cd scripts && python3 -m venv .venv && pip3 install certifi==2025.1.31 charset-normalizer==3.4.1 idna==3.10 pip==24.3.1 requests==2.32.3 urllib3==2.3.0 && cd ..
  ```

3. **How to run**

  ```sh
    npm start 
  ```

### Template : <https://dennistretyakov.com/first-electron-app-with-react-and-typescript/>

# How to use it

1. **How to add/use button**

```sh
    You go to the src/components/ui/buttonStyles.ts ,and there you add in the variant how it should look like, with the name
```

2. **Example usage:**

```
<Button
      onClick={onSearch}
      variant="primary"
      btnSize="xs"
    >
      Search
    </Button>
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
