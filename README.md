# simple-webpage-template
Run a simple web page/site with lite-server when you want to prototype something.

## How to use

1. Just clone the repo into a new repository.

    ```
    git clone https://github.com/sampathsris/simple-webpage-template.git new-repo-name
    cd new-repo-name
    ```

2. start editing `public/index.html` (also edit the author name in `package.json`, etc., if you must).
    - `public/index.html` is just the starting point.
    - Any assets in `public` directory would be served by `lite-server`.

3. Then run the page/site with,

    ```
    npm run dev
    ```

    or,

    ```
    yarn dev
    ```

4. Profit!
