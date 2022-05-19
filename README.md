## Payment Portal RSHB

###One account for test mode

example config.php

```php
return array(
    'urlRegister' => 'url for register of order',
    'returnUrl' => 'url for redirect after payment completed',
    'merchant' => array(
      'test' => array(
            'login' => 'login account api',
            'password' => 'password account api',
        ),
    ),
    'KBK' => array(
        'main' => 'main KBK',
        'donate' => 'donate KBK'
    )
);
```

###Some account for production mode

example config.php

```php
return array(
    'urlRegister' => 'url for register of order',
    'returnUrl' => 'url for redirect after payment completed',
    'merchant' => array(
        'mainEdu' => array(
            'login' => 'login account api',
            'password' => 'password account api',
        ),
        'addEdu' => array(
            'login' => 'login account api',
            'password' => 'password account api',
        ),
        'hostel' => array(
            'login' => 'login account api',
            'password' => 'password account api',
        ),
        'donate' => array(
            'login' => 'login account api',
            'password' => 'password account api',
        ),
    ),
    'KBK' => array(
        'main' => 'main KBK',
        'donate' => 'donate KBK'
    )
);
```

