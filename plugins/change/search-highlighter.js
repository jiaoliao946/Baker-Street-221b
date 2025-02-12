//原：https://github.com/DaichiAndoh/docsify-search-highlighter
const KEYWORD_TAG = '{keyword}';
const DEFAULT_HIGHLIGHT_COLOR = 'yellow';

function init() {
  if(location.pathname == "/") return ;     //改
  const searchInput = getSearchInputEle($docsify.search.placeholder);
  if (searchInput === null) {
    console.error('[search-highlighter] search input which placeholder is $docsify.search.placeholder is not found.');
    return;
  }

  const clearBtn = getClearBtnEle();
  if (clearBtn === null) {
    console.error('[search-highlighter] clear button is not found.');
    return;
  }

  searchInput.addEventListener('change', function (e) {
    const keyword = e.target.value;

    const postNodes = document.querySelectorAll('.matching-post');
    postNodes.forEach(function (pNode) {
      pNode.addEventListener('click', function (_) {
        setTimeout(() => {
          const article = document.getElementById('main');
          if (article) {
            const articleNodes = Array.from(article.children);
            let foundFirstNode = false;

            articleNodes.forEach(function (aNode) {
              const keywordRe = new RegExp(keyword, 'g');
              const tagRe = new RegExp(KEYWORD_TAG, 'g');
              const replaceText = `<span style="background-color: ${$docsify.searchHighlightColor};">${keyword}</span>`;

              if (aNode.innerHTML.match(keywordRe)) {
                if (!foundFirstNode) {
                  aNode.scrollIntoView({ behavior: 'smooth' });
                  foundFirstNode = true;
                }

                replaceKeywordToTag(aNode, keyword, KEYWORD_TAG);
                aNode.innerHTML = aNode.innerHTML.replace(tagRe, replaceText);
              }
            });
          }
        }, 700);
      });
    });
  });

  searchInput.addEventListener('input', function (e) {
    const keyword = e.target.value;

    if (keyword === '') {
      const article = document.getElementById('main');
      if (article) {
        const articleNodes = Array.from(article.children);

        articleNodes.forEach(function (aNode) {
          removeHighlight(aNode);
        });
      }
    }
  });

  clearBtn.addEventListener('click', function (e) {
    const article = document.getElementById('main');
    if (article) {
      const articleNodes = Array.from(article.children);

      articleNodes.forEach(function (aNode) {
        removeHighlight(aNode);
      });
    }
  });
}

function getSearchInputEle(placeholder) {
  if (typeof placeholder === 'string') {
    return document.querySelector(`input[placeholder="${placeholder}"]`);
  } else if (typeof placeholder === 'object') {
    for (const ph of Object.values(placeholder)) {
      const searchInput = document.querySelector(`input[placeholder="${ph}"]`);
      if (searchInput) return searchInput;
    }

    return null;
  }
}

function getClearBtnEle() {
  return document.querySelector('.clear-button');
}

function replaceKeywordToTag(node, keyword, tag = KEYWORD_TAG) {
  const keywordRe = new RegExp(keyword, 'g');

  if (node.childNodes.length) {
    for(node of node.childNodes){
      replaceKeywordToTag(node, keyword, tag);
    }
  } else {
    if(node.nodeName == '#text' && node.nodeValue.includes(keyword)){
      node.nodeValue = node.nodeValue.replace(keywordRe, tag);
    }
  }
}

function removeHighlight(node) {
  const highlightRe = new RegExp(`<span[^>]*style\\s*=\\s*["'][^"']*background-color\\s*:\\s*${$docsify.searchHighlightColor}[^"']*["'][^>]*>(.*?)<\\/span>`, 'g');

  if (node.innerHTML.match(highlightRe)) {
    node.innerHTML = node.innerHTML.replace(highlightRe, '$1');
  }
}

function searchHighlighter(hook) {
  if (!$docsify.search || !$docsify.search.placeholder) {
    console.error('[search-highlighter] $docsify.search.placeholder is required.');
    return;
  }

  if (!$docsify.searchHighlightColor) {
    $docsify.searchHighlightColor = DEFAULT_HIGHLIGHT_COLOR;
  }

  hook.doneEach(init);
};

$docsify = $docsify || {};
$docsify.plugins = [].concat($docsify.plugins || [], searchHighlighter);
