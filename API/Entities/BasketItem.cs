namespace API.Entities
{
    public class BasketItem
    {
        public int Id {get;set;}
        public string UserName {get;set;}
        public int MovieId {get;set;}
         public string Title {get;set;}
        public string PosterUrl {get;set;}
        public int Quantity {get;set;}
    }
}