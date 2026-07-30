KISNA v13 CMS — GitHub + Netlify

正确目录（上传后 GitHub 首页必须看到）：
admin/
assets/
data/
index.html
resultados.html
resultados-cms.js
netlify.toml

上传方法：
1. 解压本 ZIP。
2. 在 GitHub 仓库删除旧的错误文件。
3. Add file > Upload files。
4. 把“解压后文件夹里面的全部内容”一起拖入上传区域。
   必须看到 admin、assets、data 三个文件夹；不要单独上传文件夹里的图片。
5. Commit changes，等待 Netlify 自动部署。

Netlify 后台启用：
1. 在 Netlify 为此站点启用 Identity。
2. Registration preferences 选择 Invite only。
3. 启用 Git Gateway。
4. 邀请你自己的邮箱并完成设置密码。
5. 访问 https://kisnalisado.es/admin/

后台使用：
进入“Resultados antes y después” > “Galería de resultados”。
添加标题、发质、Before、After，保存并发布。Netlify 会自动重新部署。

注意：
- 不要删除 assets、admin 或 data 文件夹。
- 后台能否登录取决于 Netlify Identity 与 Git Gateway 是否已经在站点中启用。
