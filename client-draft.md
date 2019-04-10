        <Landing>
          <Button className="create" />
          <Input className="username" />
          <Input className="roomsize" />
          <Input className="amount" />
          <Button className="confirm deploy" />
          <Button className="join" />
          <Input className="username" />
          <Input className="address" />
          <Input className="roomcode" />
          <Input className="amount" />
          <Button className="confirm register" />
        </Landing>
        <Voting>
          <DragableList>
            <User />
          </DragableList>
          <Button className="confirm vote" />
          <RoomInfo />
          <PrizeDistribution />
          <Button className="killswitch" />
        </Voting>
