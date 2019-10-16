import Mock from "mockjs";

const articleList = Mock.mock({
  "list|113": [{
    id: "@lower(@guid)",
    author: '@cname',
    createDate: '@datetime("yyyy-MM-dd HH:mm:ss")',
    title: "@ctitle",
    type: '@pick(["新闻", "财经", "娱乐", "体育", "科技", "游戏"])',
    browseNum: "@natural(1000,9999)",
  }],
})

const articleDetail = Mock.mock({
  id: "@lower(@guid)",
  title: "@ctitle",
  author: '@cname',
  date: '@datetime("yyyy-MM-dd HH:mm:ss")',
  imageUrl: 'https://s2.ax1x.com/2019/08/02/edRc1P.jpg',
  brief: '@cparagraph(2,5)',
  type: '@pick(["1", "2", "3", "4", "5"])',
  browseNum: "@natural(1000,9999)",
  content: "@cparagraph",
}
)

export default {
  getList(config) {
    const { type, author, pageNumber, pageSize, title } = window.JSON.parse(config.body);

    const authorsLength = author.length;
    const typesLength = type.length;
    const filterList = articleList.list.filter(item => {
      let validAuthor = false;
      let validType = false;
      let validTitle = false;

      if (authorsLength === 0) {
        validAuthor = true;
      } else {
        validAuthor = author.some(item1 => {
          return item.author.includes(item1);
        })
      }

      if (typesLength === 0) {
        validType = true;
      } else {
        validType = type.some(item1 => {
          return item.type.includes(item1);
        })
      }

      validTitle = item.title.includes(title);
      return validAuthor && validType && validTitle;
    })

    const startIndex = (Number(pageNumber) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    return {
      code: 200,
      data: {
        articleList: filterList.slice(startIndex, endIndex),
        total: filterList.length
      }
    }
  },
  getDetail(config) {
    return {
      code: 200,
      data: { articleDetail }
    }
  }
}
