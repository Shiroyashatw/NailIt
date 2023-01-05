using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class CreditCardTable
    {
        public int CreditCardId { get; set; }
        public int CreditCardOwner { get; set; }
        public string CreditCardNumber { get; set; }
    }
}
