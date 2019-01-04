const Mock = require('mockjs')
const subjectNames = ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理", "科学", "其他"];

module.exports = {
  'GET /homework/list/random': function(ctx) {
    const reponseData = Mock.mock({
      "list|20": [
        {
          "homeworkId|+1": 1,
          "subjectId": function() {
              return subjectNames.indexOf(this.subjectName) + 1;
          },
          "subjectName|1": subjectNames,
          "typeName|1": ["视频", "试题"]
        },
      ]
    }).list

    ctx.body = reponseData
  }
}
