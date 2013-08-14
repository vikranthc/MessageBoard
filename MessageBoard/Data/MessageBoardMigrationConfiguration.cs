using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;

namespace MessageBoard.Data
{
    public class MessageBoardMigrationsConfiguration : DbMigrationsConfiguration<MessageBoardContext>
    {
        public MessageBoardMigrationsConfiguration()
        {
            this.AutomaticMigrationDataLossAllowed = true;
            this.AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(MessageBoardContext context)
        {
            base.Seed(context);

#if DEBUG
            if (!context.Topics.Any())
            {
                var topic = new Topic()
                    {
                        Title = "I love MVC",
                        Created = DateTime.Now,
                        Body = "I love ASP.NET MVC and I want everyone to know",
                        Replied = new List<Reply>()
                            {
                                new Reply()
                                    {
                                        Body = "I love it too",
                                        Created = DateTime.Now
                                    },
                                new Reply()
                                    {
                                        Body = "Me too",
                                        Created= DateTime.Now
                                    }                            }
                    };
                context.Topics.Add(topic);

                var anotherTopic = new Topic()
                {
                    Title = "I love Ruby",
                    Created = DateTime.Now,
                    Body = "I love Ruby and I want everyone to know",
                    Replied = new List<Reply>()
                            {
                                new Reply()
                                    {
                                        Body = "I love it too",
                                        Created = DateTime.Now
                                    },
                                new Reply()
                                    {
                                        Body = "Me too",
                                        Created= DateTime.Now
                                    }                            }
                };
                context.Topics.Add(anotherTopic);

                context.SaveChanges();
            }
#endif
        }
    }
}
