# Welcome to MkDocs

This is a custom implementation of zoom/pan for Mermaid diagrams in MkDocs.  
Uses:

- [mkdocs.org](https://www.mkdocs.org)
- [mkdocs-material](https://github.com/squidfunk/mkdocs-material)
- [d3.js](https://github.com/d3/d3)
- [fontawesome](https://fontawesome.com/docs/web/setup/host-yourself/webfonts)

## How To use

1. copy `assets` folder to your `docs` folder

2. Configure plugins in mkdocs.yml
    ```
    plugins:
      - awesome-pages

    markdown_extensions:
      - pymdownx.superfences:
          custom_fences:
            - name: mermaid
              class: mermaid
              format: !!python/name:pymdownx.superfences.fence_code_format
      - attr_list
      - pymdownx.emoji:
          emoji_index: !!python/name:materialx.emoji.twemoji
          emoji_generator: !!python/name:materialx.emoji.to_svg
      - pymdownx.highlight
      - pymdownx.inlinehilite
    ```

3. Add to mkdocs.yml
    ```
    extra_css:
      - assets/stylesheets/mermaid-zoom-controls.css
      - assets/fontawesome/css/solid.css
      - assets/fontawesome/css/fontawesome.css

    extra_javascript:
      - https://cdn.jsdelivr.net/npm/d3@7
      - assets/javascripts/mermaid-zoom-controls.js
    ```


## How to run locally

1. 
    ```
    pip install mkdocs
    ```
2. 
    ```
    pip install mkdocs-material
    ```
3. 
    ```
    pip install mkdocs-awesome-pages-plugin
    ```
4. 
    ```
    mkdocs serve
    ```
