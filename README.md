
## Task 1 - Modernization of the membership codebase (backend only)

Before your team can start to implement new features, you guys decided to **modernize the backend codebase** first.

Your task is to **refactor two endpoints** implemented in the **legacy codebase** that can be used to list and create memberships:

GET /legacy/memberships (`src/legacy/routes/membership.routes.js`)
POST /legacy/memberships (`src/legacy/routes/membership.routes.js`)

Your new implementation should be accessible through new endpoints in the **modern codebase** that are already prepared:

GET /memberships (`src/modern/routes/membership.routes.ts`)
POST /memberships (`src/modern/routes/membership.routes.ts`)

When refactoring, you should consider the following aspects:

- The response from the endpoints should be exactly the same. Use the same error messages that are used in the legacy implementation.
- You write read- and maintainable code
- You use Typescript instead of Javascript to enabled type safety
- Your code is separated based on concerns
- Your code is covered by automated tests to ensure the stability of the application

> [!NOTE]
> For the scope of this task, the data used is mocked within the json files `membership.json` and `membership-periods.json`

> [!NOTE]
> We provided you with an clean express.js server to run the example. For your implementations, feel free to use any library out there to help you with your solution. If you decide to choose another JavaScript/TypeScript http library/framework (eg. NestJs) update the run config described below if needed, and ensure that the routes of the described actions don't change.


## Task 2 - Design an architecture to provide a membership export (conception only)

The team discovered that users are interested in **exporting all of their memberships** from the system to run their own analysis once a month as a **CSV file**. Because the creation of the export file would take some seconds, the team decided to go for an **asynchronous process** for creating the file and sending it via email. The process will be triggered by an API call of the user. 

Your task is to **map out a diagram** that visualizes the asynchronous process from receiving the request to sending the export file to the user. This diagram should include all software / infrastructure components that will be needed to make the process as stable and scalable as possible. 

Because the team has other things to work on too, this task is timeboxed to **1 hour** and you should share the architecture diagram as a **PDF file**.

> [!NOTE]
> Feel free to use any tool out there to create your diagram. If you are not familiar with such a tool, you can use www.draw.io. 

## Prerequisites for Production
1. Redis, it should be bound to localhost on port 6379
 `$ docker run --name redis-task -d redis`

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
