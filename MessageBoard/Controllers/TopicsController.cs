using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MessageBoard.Data;

namespace MessageBoard.Controllers
{
    public class TopicsController : ApiController
    {
        private IMessageBoardRepository _repo { get; set; }

        public TopicsController(IMessageBoardRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<Topic> Get(bool includeReplies = false)
        {
            IQueryable<Topic> results;

            if (includeReplies)
            {
                results = _repo.GetTopicsIncludingReplies().OrderByDescending(c => c.Created).Take(25);
            }
            else
            {
                results = _repo.GetTopics().OrderByDescending(c => c.Created).Take(25);
            }

            return results;
        }

        public HttpResponseMessage Post([FromBody]Topic newTopic)
        {
            if (newTopic.Created == default(DateTime))
            {
                newTopic.Created = DateTime.UtcNow;
            }

            if (_repo.AddTopic(newTopic) && _repo.Save())
            {
                return Request.CreateResponse(HttpStatusCode.Created, newTopic);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

    }
}
