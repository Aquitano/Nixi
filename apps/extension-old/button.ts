/**
 * Send article data to backend
 *
 * @param {CreateArticleDto} data - Full article data
 */
async function sendArticle(data: CreateArticleDto) {
  const articleId = await axiosInstance({
    method: 'post',
    url: 'http://localhost:8200/articles',
    data,
  })
    .then((response) => {
      addMessage(`${response.statusText} with id ${response.data.id}`, ColorClasses.success);
      addTagPrompt(response.data.id);
      return response.data.id;
    })
    .catch((error) => {
      addMessage(error, ColorClasses.error);
      return null;
    });

  await axiosInstance({ method: 'get', url: `http://localhost:8200/articles/tags/${articleId}` })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      addMessage(error, ColorClasses.error);
    });
}
