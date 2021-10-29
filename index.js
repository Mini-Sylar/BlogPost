const { ApolloServer, gql } = require("apollo-server");
const port = process.env.PORT || 8000;

var i = -1;
var j = -1;
function increment(n) {
  n++;
  return n;
}

function incrementReply(n) {
  n++;
  return n;
}

const blogs = [
  {
    title: "Blog 1",
    author: "Author 1",
    content: "ipsum lorem text here",
    likes: 0,
    comment: [],
    replies: [],
    banner: "Url To Image",
  },
  {
    title: "Blog 2",
    author: "Author 2",
    content: "ipsum lorem text here",
    likes: 0,
    comment: [],
    replies: [],
    banner: "Url To Image",
  },

  {
    title: "Blog 3",
    author: "Author 3",
    content: "ipsum lorem text here",
    likes: 0,
    comment: [],
    replies: [],
    banner: "Url To Image",
  },
];

const schemas = gql`
  type Blog {
    title: String
    author: String
    content: String
    likes: Int
    comment: [String]
    replies: [String]
    banner: String
  }

  type Query {
    blogs: [Blog]
    blogTitle(title: String!): Blog
    blogContent(title: String): Blog
  }

  type Mutation {
    createBlog(
      title: String!
      author: String!
      content: String!
      likes: Int
      comment: [String]
      reply: [String]
      banner: String
    ): Blog
    # Other
    updateBlog(title: String!, author: String, content: String!): Blog
    deleteBlog(title: String!): Blog
    likeBlog(title: String): Blog
    unlikeBlog(title: String): Blog
    comment(title: String, comment: [String]): Blog
    deleteComment(title: String, comment: [String]): Blog
    replyComment(title: String, comment: [String], replies: [String]): Blog
  }
`;

const blogResolvers = {
  Query: {
    blogs: () => blogs, //Returns general information
    blogTitle: (parent, args) =>
      blogs.find((blog) => blog.title === args.title), // return specfic
    blogContent: (parent, args) =>
      blogs.find((blog) =>
        blog.title === args.title ? blog.content : "No content found"
      ),
  },

  Mutation: {
    createBlog: (parent, args) => {
      const {
        title,
        author,
        content,
        likes = 0,
        comment = [],
        replies = [],
        banner = "Url To Image",
      } = args;
      const blog = { title, author, content, likes, comment, replies, banner };
      blogs.push(blog);
      return blog;
    },
    updateBlog: (parent, args) => {
      const { title, content } = args;
      const location = blogs.findIndex((blog) => blog.title === args.title);
      blogs[location].content = content;
      return args;
    },
    deleteBlog: (parent, args) => {
      const location = blogs.findIndex((blog) => blog.title === args.title);
      blogs.splice(location, 1);
      return args;
    },
    likeBlog: (parent, args) => {
      const location = blogs.findIndex((blog) => blog.title === args.title);
      blogs[location].likes += 1;
      
    },
    unlikeBlog: (parent, args) => {
      const location = blogs.findIndex((blog) => blog.title === args.title);
      if (blogs[location].likes <= 0) {
        console.log("Nothing to unlike");
      } else {
        blogs[location].likes -= 1;
      }
      return args;
    },
    comment: (parent, args) => {
      const { comment } = args;
      const location = blogs.findIndex((blog) => blog.title === args.title);
      const final = blogs[location].comment.push(
        String([(i = increment(i)), comment])
      );
      return args;
    },

    deleteComment: (parent, args) => {
      const { comment } = args;
      const location = blogs.findIndex((blog) => blog.title === args.title);
      let findvalue = (arrayindex, whichvalue) =>
        blogs[0].comment[arrayindex].indexOf(whichvalue);
      const comment_location = blogs[location].comment.splice(
        findvalue(...comment, ...comment),
        1
      );
      console.log(comment_location[0]);
      return args;
    },
    replyComment: (parent, args) => {
      const { replies, comment } = args;
      const location = blogs.findIndex((blog) => blog.title === args.title);
      const indexcomment = blogs[location].comment[location][[comment][0]];
      console.log(indexcomment);
      if (blogs[location].comment.length != 0)
        blogs[location].replies.push(String([indexcomment, replies]));
      else {
        console.log("No comment exist for you to reply to");
      }
      return args;
    },
  },
};

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers: blogResolvers,
  playground: true,
  introspection: true,
});

server
  .listen(port)
  .then(({ url, port }) => {
    console.log(`Server ready at ${url}`);
  })
  .catch((err) => console.log(err));
