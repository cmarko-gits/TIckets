namespace API.Entities
{
    public class Reservation
    {
        public int Id {get;set;}
        public string Username {get;set;} = string.Empty;
        public int MovieId {get;set;}
        public DateTime ReservationDate { get; set; }
        public int NumberOfTickets { get; set; }
        public bool IsWatched { get; set; } = false;

    }
}